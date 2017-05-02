# -*- encoding:utf-8 -*-
import uuid
import datetime
from util import *


class MyException(Exception):
    pass


class DocumentParser:
    def __init__(self, filepath):
        self.uploaded_file = filepath

    token_breaker = '-', ',', '.'
    token_breaker_2 = "'s", "\'s"

    sentence_breaker = '.',

    @classmethod
    def get_base_document(cls, document_index=0, modified_date=0):
        document_id = uuid.uuid1()
        document_id = str(document_id) + "-{0}".format(document_index)
        document = {"id": document_id,
                    "name": None,
                    "text": None,
                    "status": "READY",
                    "modifiedDate": modified_date}
        return document

    @classmethod
    def get_base_ground_truth(cls, document):
        ground_truth = {"id": document["id"],
                        "name": document["name"],
                        "version": 3,
                        "text": document["text"],
                        "docLength": 0,
                        "language": "EN",
                        "modifiedDate": document["modifiedDate"],
                        "documentSet": [],
                        "preannotation": [],
                        "sentences": [],
                        "mentions": [],
                        "relations": [],
                        "corefs": [],
                        "typeResolved": True,
                        "userResolved": False}
        return ground_truth

    @classmethod
    def get_base_sentence(cls):
        sentence = {"id": None,
                    "begin": 0,
                    "end": 150,
                    "text": None,
                    "tokens": []}
        return sentence

    @classmethod
    def get_base_token(cls):
        token = {"id": None,
                 "begin": 0,
                 "end": 150,
                 "text": None,
                 "whiteSpace": False}
        return token

    @classmethod
    def get_epoch_time(cls):
        epoch = datetime.datetime.utcfromtimestamp(0)
        return int((datetime.datetime.today() - epoch).total_seconds() * 1000.0)

    def csv_parser(self):
        print self.uploaded_file
        f = open(self.uploaded_file, 'r')
        data = f.read()
        f.close()
        """
        http://www.kimgentes.com/worshiptech-web-tools-page/2008/10/14/regex-pattern-for-parsing-csv-files-with-embedded-commas-dou.html

        ("(?:[^"]|"")*"|[^,]*)*(,("(?:[^"]|"")*"|[^,]*))
        """

        """
        for match in pattern.finditer(data):
            print match.groups()[0]
        """
        documents = self.document_parser(data)
        self.ground_truth_parser(documents)

    def document_parser(self, data):

        offset = 0
        str_buffer = []
        is_name = True
        is_in_quote = False
        documents = []

        document_index = 1
        modified_date = self.get_epoch_time()
        tmp_document = self.get_base_document(document_index=document_index, modified_date=modified_date)

        """에라 모르겠다...정규식은 실패임"""
        try:
            length = len(data)

            iter_data = iter(data)

            for char in iter_data:

                if is_name:
                    if char == ",":
                        tmp_document["name"] = ''.join(str_buffer).strip()
                        str_buffer = []
                        is_name = False

                    else:
                        str_buffer.append(char)

                else:
                    if is_in_quote:
                        if char == '"':
                            if offset + 1 < length and data[offset + 1] == '"':
                                str_buffer.append(char)
                                # str_buffer.append(data[offset + 1])
                                iter_data.next()

                            else:
                                tmp_document["text"] = ''.join(str_buffer).strip()
                                str_buffer = []
                                is_name = True
                                is_in_quote = False
                                documents.append(tmp_document)
                                document_index += 1
                                tmp_document = self.get_base_document(document_index=document_index,
                                                                      modified_date=modified_date)

                        else:
                            str_buffer.append(char)

                    else:
                        if char == '"':
                            is_in_quote = True
                        else:
                            if char == " " or char == "\t":
                                pass
                            else:
                                raise MyException("wrong document format")

                offset += 1
            # print documents

        except MyException as e:
            log_exception(e)
        except Exception as e:
            log_exception(e)

        return documents

    def ground_truth_parser(self, documents):
        str_buffer = []
        is_begin_set = False
        for document in documents:
            ground_truth = self.get_base_ground_truth(document)
            text = ground_truth["text"]
            offset = 0
            begin = 0
            length = len(text)
            iter_data = iter(text)
            try:
                for char in iter_data:
                    if char == "\r":
                        if offset + 1 < length and text[offset + 1] == '\r':
                            self.sentence_parser(ground_truth=ground_truth, begin=begin, sentence_buffer=str_buffer)
                            str_buffer = []
                            iter_data.next()
                            offset += 1
                            is_begin_set = False
                        else:
                            str_buffer.append(char)
                    elif char in self.sentence_breaker:
                        str_buffer.append(char)
                        self.sentence_parser(ground_truth=ground_truth, begin=begin, sentence_buffer=str_buffer)
                        str_buffer = []
                        is_begin_set = False

                    else:
                        str_buffer.append(char)
                        if not is_begin_set:
                            begin = offset
                            is_begin_set = True

                    offset += 1
                self.sentence_parser(ground_truth=ground_truth, begin=begin, sentence_buffer=str_buffer)
            except Exception as e:
                log_exception(e)

            print ground_truth

    def sentence_parser(self, ground_truth, begin, sentence_buffer):
        text = ''.join(sentence_buffer).rstrip()

        begin += (len(text) - len(text.lstrip()))

        text = text.lstrip()
        length = len(text)
        if length > 0:
            sentence = self.get_base_sentence()
            sentence_id = "s" + str(len(ground_truth["sentences"]))
            sentence["id"] = sentence_id
            sentence["begin"] = begin

            end = len(text.lstrip()) + begin

            sentence["end"] = end
            sentence["text"] = text

            str_buffer = []
            iter_data = iter(text)
            offset = begin
            begin = begin
            text_offset_diff = begin
            is_begin_set = False

            for char in iter_data:
                text_offset = offset - text_offset_diff
                if offset > 227:
                    pass
                if char == ' ' or char == '\t':
                    self.token_parser(sentence=sentence, sentence_id=sentence_id, begin=begin, token_buffer=str_buffer)
                    str_buffer = []
                    is_begin_set = False
                elif char in self.token_breaker:
                    self.token_parser(sentence=sentence, sentence_id=sentence_id, begin=begin, token_buffer=str_buffer)
                    str_buffer = []
                    begin = offset
                    str_buffer.append(char)
                    self.token_parser(sentence=sentence, sentence_id=sentence_id, begin=begin, token_buffer=str_buffer)
                    str_buffer = []
                    is_begin_set = False
                elif text_offset + 1 < length and char + text[text_offset+1] in self.token_breaker_2:
                    self.token_parser(sentence=sentence, sentence_id=sentence_id, begin=begin, token_buffer=str_buffer)
                    str_buffer = []
                    begin = offset
                    str_buffer.append(char)
                    str_buffer.append(text[text_offset + 1])
                    self.token_parser(sentence=sentence, sentence_id=sentence_id, begin=begin, token_buffer=str_buffer)
                    iter_data.next()
                    offset += 1
                    str_buffer = []
                    is_begin_set = False
                else:
                    str_buffer.append(char)
                    if not is_begin_set:
                        begin = offset
                        is_begin_set = True

                offset += 1

            ground_truth["sentences"].append(sentence)

    def token_parser(self, sentence, sentence_id, begin, token_buffer):
        text = ''.join(token_buffer).rstrip()

        begin += len(text) - len(text.lstrip())
        text = text.lstrip()

        if len(text) > 0:
            token = self.get_base_token()
            token_id = sentence_id + "-t" + str(len(sentence["tokens"]))
            token["id"] = token_id
            token["begin"] = begin
            end = len(text.lstrip()) + begin
            token["end"] = end
            token["text"] = text
            sentence["tokens"].append(token)
